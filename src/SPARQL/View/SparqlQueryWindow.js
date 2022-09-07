import { Window } from 'ud-viz/src/Widgets/Components/GUI/js/Window';
import { SparqlEndpointResponseProvider } from '../ViewModel/SparqlEndpointResponseProvider';
import { Graph } from '../Model/Graph';
import { Table } from '../Model/Table';
import * as URI from '../Model/URI';
import { LayerManager } from 'ud-viz/src/Components/Components';
import { CityObjectProvider } from 'ud-viz/src/Widgets/CityObjects/ViewModel/CityObjectProvider';
import { JsonRenderer } from './JsonRenderer';
import './SparqlQueryWindow.css';

/**
 * The SPARQL query window class which provides the user interface for querying
 * a SPARQL endpoint and displaying the endpoint response.
 */
export class SparqlQueryWindow extends Window {
  /**
   * Creates a SPARQL query window.
   * @param {SparqlEndpointResponseProvider} sparqlProvider The SPARQL Endpoint Response Provider
   * @param {CityObjectProvider} cityObjectProvider The City Object Provider
   * @param {LayerManager} layerManager The UD-Viz LayerManager.
   */
  constructor(sparqlProvider, cityObjectProvider, layerManager) {
    super('sparqlQueryWindow', 'SPARQL Query');

    /**
     * The SPARQL Endpoint Response Provider
     *
     * @type {SparqlEndpointResponseProvider}
     */
    this.sparqlProvider = sparqlProvider;

    /**
     * The Extended City Object Provider
     *
     * @type {CityObjectProvider}
     */
    this.cityObjectProvider = cityObjectProvider;

    /**
     *A reference to the JsonRenderer class
     * @type {JsonRenderer}
     */
    this.jsonRenderer = new JsonRenderer();

    /**
     * The UD-Viz LayerManager.
     *
     * @type {LayerManager}
     */
    this.layerManager = layerManager;

    /**
     * Contains the D3 graph view to display RDF data.
     *
     * @type {Graph}
     */
    this.graph = new Graph(this);

    /**
     * Contains the D3 table to display RDF data.
     *
     * @type {Table}
     */
    this.table = new Table(this);

    /**
     * The initial SPARQL query to display upon window initialization.
     *
     * @type {string}
     */
    this.default_query = `PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl:  <http://www.w3.org/2002/07/owl#>
PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>
PREFIX gmlowl:  <http://www.opengis.net/ont/gml#>
PREFIX units: <http://www.opengis.net/def/uom/OGC/1.0/>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
PREFIX core: <http://www.opengis.net/citygml/2.0/core#>
PREFIX bldg: <http://www.opengis.net/citygml/building/2.0/building#>

# Return all CityGML City Objects
SELECT *
WHERE {
  ?subject a core:CityModel ;
    ?predicate ?object .
  ?subject a ?subjectType .
  ?object a bldg:Building .
  ?object a ?objectType .
  
  FILTER(?subjectType != owl:NamedIndividual)
  FILTER(?objectType != owl:NamedIndividual)
}
LIMIT 100`;
    this.registerEvent(Graph.EVENT_NODE_CLICKED);
    this.registerEvent(Table.EVENT_CELL_CLICKED);
  }

  /**
   * Override the windowCreated function. Sets the SparqlEndpointResponseProvider
   * and graph view. Should be called by a `SparqlModuleView`. Once this is done,
   * the window is actually usable ; service event listerers are set here.
   * @param {SparqlEndpointService} service The SPARQL endpoint service.
   */
  windowCreated() {
    this.form.onsubmit = () => {
      this.sparqlProvider.querySparqlEndpointService(this.queryTextArea.value);
      return false;
    };

    this.sparqlProvider.addEventListener(
      SparqlEndpointResponseProvider.EVENT_ENDPOINT_RESPONSE_UPDATED,
      (response) =>
        this.updateDataView(
          response,
          document.getElementById(this.resultSelectId).value
        )
    );

    this.addEventListener(Graph.EVENT_NODE_CLICKED, (node_text) =>
      this.cityObjectProvider.selectCityObjectByBatchTable(
        'gml_id',
        URI.tokenizeURI(node_text).id
      )
    );

    this.addEventListener(Table.EVENT_CELL_CLICKED, (cell_text) =>
      this.cityObjectProvider.selectCityObjectByBatchTable(
        'gml_id',
        URI.tokenizeURI(cell_text).id
      )
    );
  }

  /**
   * Update the DataView.
   * @param {Object} data SPARQL query response data.
   * @param {Object} view_type The selected semantic data view type.
   */
  updateDataView(response, view_type) {
    console.debug(response);
    this.clearDataView();
    switch (view_type) {
      case 'graph':
        this.graph.update(this.graph.formatResponseDataAsGraph(response));
        this.dataView.append(this.graph.canvas);
        break;
      case 'json':
        this.jsonRenderer.renderjson.set_icons('▶', '▼');
        this.jsonRenderer.renderjson.set_max_string_length(40);
        this.dataView.append(this.jsonRenderer.renderjson(response));
        break;
      case 'table':
        this.table.dataAsTable(response.results.bindings, response.head.vars);
        this.table.filterInput.addEventListener('change', (e) =>
          Table.update(this.table, e)
        );
        this.dataView.style['height'] = '500px';
        this.dataView.style['overflow'] = 'scroll';
        break;
      default:
        console.error('This result format is not supported: ' + view_type);
    }
  }

  /**
   * Clear the DataView of content.
   */
  clearDataView() {
    this.dataView.innerHTML = '';
    this.dataView.style['height'] = '100%';
    this.dataView.style['overflow'] = 'auto';
  }

  // SPARQL Window getters //
  get innerContentHtml() {
    return /*html*/ `
      <form id=${this.formId}>
        <label for="${this.queryTextAreaId}">Query:</label></br>
        <textarea id="${this.queryTextAreaId}" rows="20">${this.default_query}</textarea></br>
        <input id="${this.queryButtonId}" type="submit" value="Send"/>
        <label>Results Format: </label>
        <select id="${this.resultSelectId}">
          <option value="graph">Graph</option>
          <option value="table">Table</option>
          <option value="json">JSON</option>
          <option value="timeline">Timeline</option>
        </select>
      </form>
      <hr/>
      <div id="${this.dataViewId}"/>`;
  }

  get dataViewId() {
    return `${this.windowId}_data_view`;
  }

  get dataView() {
    return document.getElementById(this.dataViewId);
  }

  get formId() {
    return `${this.windowId}_form`;
  }

  get form() {
    return document.getElementById(this.formId);
  }

  get resultSelectId() {
    return `${this.windowId}_resultSelect`;
  }

  get resultSelect() {
    return document.getElementById(this.resultSelectId);
  }

  get queryButtonId() {
    return `${this.windowId}_query_button`;
  }

  get queryButton() {
    return document.getElementById(this.queryButtonId);
  }

  get queryTextAreaId() {
    return `${this.windowId}_query_text_area`;
  }

  get queryTextArea() {
    return document.getElementById(this.queryTextAreaId);
  }
}
