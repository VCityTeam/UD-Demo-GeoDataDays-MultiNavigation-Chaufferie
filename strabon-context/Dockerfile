FROM bde2020/strabon

# Enable CORS support for Strabon/tomcat frontend 
ADD web.xml /tomcat/conf/web.xml

# Download RDF datasets
                                       # https://partage.liris.cnrs.fr/index.php/f/200057340
RUN wget --output-document=/ifc_doua.rdf https://partage.liris.cnrs.fr/index.php/s/PsDzN27tqSQg3CW/download/ifc_doua.rdf
                                      # https://partage.liris.cnrs.fr/index.php/f/200057887
RUN wget --output-document=/la_doua.zip https://partage.liris.cnrs.fr/index.php/s/ijCzgsqdmNNFkDX/download

# Cleanup
RUN unzip /la_doua.zip && \
    mv /La_Doua_2009-2018/*.rdf / && \
    rm -rf /La_Doua_2009-2018 /la_doua.zip
