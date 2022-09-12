FROM bde2020/strabon

# Enable CORS support for Strabon/tomcat frontend 
ADD web.xml /tomcat/conf/web.xml

# Download RDF datasets
RUN wget --output-document=/ifc_doua.rdf https://partage.liris.cnrs.fr/index.php/s/PsDzN27tqSQg3CW/download/ifc_doua.rdf
    # ifc_doua.rdf
RUN wget --output-document=/la_doua.zip https://partage.liris.cnrs.fr/index.php/s/RAakYgzR8wno6SM/download
    # DOUA_BATI_2009_stripped_split.rdf
    # DOUA_BATI_2012_stripped_split.rdf
    # DOUA_BATI_2015_stripped_split.rdf
    # DOUA_BATI_2018_stripped_split.rdf
    # DOUA_2009-2018_Workspace.rdf

# Cleanup
RUN unzip /la_doua.zip && \
    mv /La_Doua_2009-2018/*.rdf / && \
    rm -rf /La_Doua_2009-2018 /la_doua.zip
