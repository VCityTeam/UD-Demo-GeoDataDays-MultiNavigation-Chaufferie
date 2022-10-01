# UD-Demo-GeoDataDays-MultiNavigation-Chaufferie

This demo was presented at the [GeoDataDays 2022 Geodata Challenges](https://www.geodatadays.fr/page/GeoDataDays-2022-Les-Challenges-Geodata/113) to demonstrate UD-SV : A multidimensional urban data exploration platform; a set of software components and tools dedicated to experimentation, exchange and knowledge sharing for multidimensional urban data mining. This platform provides solutions for the processing, storage and visualization of scalable urban data, notably through the integration of multimedia, 2D/3D geometries, and knowledge graphs.

![image](https://user-images.githubusercontent.com/23373264/193419944-5f40e35d-956c-40f6-9693-df5f4b24c2fe.png)
![image](https://user-images.githubusercontent.com/23373264/193419782-69bec58d-0730-4f4d-8181-541d1903a851.png)
![image](https://user-images.githubusercontent.com/23373264/193419511-bb7672d5-b621-4f51-9818-b8d7f39431dc.png)

## Installation
To begin, clone the repository:
```
git clone https://github.com/VCityTeam/UD-Demo-GeoDataDays-MultiNavigation-Chaufferie.git
cd UD-Demo-GeoDataDays-MultiNavigation-Chaufferie
```

This demo is based on UD-Viz-Template. The instructions for installing and launching the UD-Viz frontend of the demo can be found [here](https://github.com/VCityTeam/UD-Viz-Template#install-npm)

### Optional - Install the Strabon/PostGIS backend for urban data graph visualisation
[Strabon/PostGIS](https://strabon.di.uoa.gr/) backend requires Docker. Installation instructions can be found [here](https://docs.docker.com/engine/install/)

To configure the databases, edit `./.env` file to set appropriate passwords and ports for each service. For example:
```
#### PostGIS
POSTGRES_DB_NAME=endpoint
POSTGRES_USER=postgres
POSTGRES_PASSWORD=p0$tgr3$
POSTGRES_PORT=8002
POSTGRES_HOST=postgres
POSTGRES_ORDBMS=postgis
POSTGRES_VOLUME_NAME=ud_demo_geodatadays_multinavigation_chaufferie_docker_pg_volume_1

#### Strabon
STRABON_CREDENTIALS_username=endpoint
STRABON_CREDENTIALS_password=3ndpo1nt
STRABON_PORT=8001
```
Use docker compose to build and run the Strabon/PostGIS containers
```
docker compose up 
```

Next load graph data into Strabon. The docker image volume is automatically loaded with the relevant data files for the demo, however they need to be manually loaded into the Strabon database itself (automation will be implemented eventually for this step). To upload these files into Strabon to be used by the sparqlModule:
1. Open a web browser and navigate to [http://localhost:8001/strabon/](http://localhost:8001/strabon/)
2. From the left menu, click *Explore/Modify operations* then *Store*
3. Copy and paste the first filepath below into the *URI Input* field and click *Store from URI*. Repeat this process for each filepath
   1. `file:///DOUA_BATI_2009_stripped_split.rdf`
   2. `file:///DOUA_BATI_2012_stripped_split.rdf`
   3. `file:///DOUA_BATI_2015_stripped_split.rdf`
   4. `file:///DOUA_BATI_2018_stripped_split.rdf`
   5. `file:///DOUA_2009-2018_Workspace.rdf`
   6. `file:///ifc_doua.rdf`
   - ⚠️ You may be asked to enter the Strabon administrative credentials here. However, these credentials currently cannot be changed from the `.env` file. See issue [#1](https://github.com/VCityTeam/UD-Demo-Graph-SPARQL/issues/1).
   - Also note that some of these files are quite large and may take a while to load so be patient. A successfully uploaded file should read "Data stored successfully!" at the top of the interface unless there is a **504 Gateway Time-out** error. If there is a timeout error refer to the docker logs from the strabon container searching for the line `STORE was successful` to confirm the dataset was successfully uploaded.
   - ![image](https://user-images.githubusercontent.com/23373264/193312585-402e87ec-ccc3-48cd-a200-b26d17fe2554.png)

The demo can be open by navigating to [http://localhost:8000](http://localhost:8000)
