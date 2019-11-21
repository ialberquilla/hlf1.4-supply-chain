#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${P1PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ./connections/ccp-template.json 
}



ORG=producer
P0PORT=7051
P1PORT=8051
CAPORT=7054
PEERPEM=./supply-network/crypto-config/peerOrganizations/producer.example.com/tlsca/tlsca.producer.example.com-cert.pem
CAPEM=./supply-network/crypto-config/peerOrganizations/producer.example.com/ca/ca.producer.example.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > ./connections/connection-producer.json

