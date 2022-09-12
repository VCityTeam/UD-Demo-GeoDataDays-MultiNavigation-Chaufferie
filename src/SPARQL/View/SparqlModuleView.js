import { ModuleView } from 'ud-viz/src/Widgets/Components/ModuleView/ModuleView';
import { SparqlEndpointResponseProvider } from '../ViewModel/SparqlEndpointResponseProvider';
import { CityObjectProviderPatch } from '../../CityObjectProviderPatch';
// import { CityObjectProvider } from 'ud-viz/src/Widgets/CityObjects/ViewModel/CityObjectProvider';
import { SparqlQueryWindow } from './SparqlQueryWindow';
import { LayerManager } from 'ud-viz/src/Components/Components';

/**
 * The SPARQL ModuleView class which manages the SPARQL query window.
 */
export class SparqlModuleView extends ModuleView {
  /**
   * Creates a new SparqlModuleView.
   *
   * @param {SparqlEndpointResponseProvider} sparqlProvider The SPARQL Endpoint Response Provider
   * @param {CityObjectProviderPatch} cityObjectProvider The City Object Provider
   * @param {LayerManager} layerManager The UD-Viz LayerManager.
   */
  constructor(sparqlProvider, cityObjectProvider, layerManager) {
    super();

    /**
     * The SPARQL Endpoint Response Provider
     *
     * @type {SparqlEndpointResponseProvider}
     */
    this.sparqlProvider = sparqlProvider;

    /**
     * The Extended City Object Provider
     *
     * @type {CityObjectProviderPatch}
     */
    this.cityObjectProvider = cityObjectProvider;

    /**
     * The UD-Viz LayerManager.
     *
     * @type {LayerManager}
     */
    this.layerManager = layerManager;

    /**
     * Contains a SparqlQueryWindow for capturing user input and displaying
     * query results.
     *
     * @type {SparqlQueryWindow}
     */
    this.window = new SparqlQueryWindow(this.sparqlProvider, this.cityObjectProvider, this.layerManager);
  }

  /**
   * Display the view
   */
  enableView() {
    this.window.appendTo(this.parentElement);
  }

  /**
   *  Close the view
   */
  disableView() {
    this.window.dispose();
  }
}
