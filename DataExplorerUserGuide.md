# Data Explorer User Guide
The Data Explorer is a UD-Viz module for visualizing urban graph data and interacting with objects in the 3D scene.

To open the explorer click on the Data Explorer button in the left panel:

![image](https://user-images.githubusercontent.com/23373264/193421610-e2ea88af-f1c6-4a76-a7cf-2d757ad5b47e.png)

## Interface

![Untitled drawing](https://user-images.githubusercontent.com/23373264/193422973-43391ead-2bf9-4113-9e92-216a5426f60e.png)

### Select Query
Use this dropdown menu to load one of several prewritten queries to vizualize urban data in UD-Viz. This demo features 5 queries:
1. **Select Buildings from Version:** Return a small subset of the CityGML Building objects within the 2018 version of Villeurbanne
2. **Select Building by ID:** Return the CityGML Building matching the ID "VILLEURBANNE_00012_23" and its immediate properties
3. **Select Ifc Slabs from Building:** Return a subset of IFC Slabs from the Chaufferie building on the La Doua Tech campus
4. **Count Ifc Slabs in Building:** Return the number of IFC Slabs from the Chaufferie building on the La Doua Tech campus
5. **Select Ifc Slab by ID:** Return an IFC Slab matching the ID "2Q4QvRyEvCrefpeva98EMR"

### Show/Hide Query
This button can toggle whether the text area for the query to be submitted is shown or not. This also allows the query to be edited before submission.

Queries are written in [SPARQL](https://www.w3.org/TR/sparql11-query/)

### Select Result Visualization Format
Use this dropdown menu to select how the query result will be visualized. Currently 3 modes are supported:
1. Graph
2. Table
3. JSON (Primarily intended for debugging purposes)

Not every query can be visualized by the Graph mode. Here is a list of which queries are supported by the graph visualization mode:

| Query | Graph Support |
|---|---|
| Select Buildings from Version | 🟢 |
| Select Building by ID | 🟢 |
| Select Ifc Slabs from Building | 🟢 |
| Count Ifc Slabs in Building | 🔴 |
| Select Ifc Slab by ID | 🟢 |
