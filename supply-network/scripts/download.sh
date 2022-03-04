#!/bin/bash
VERSION=2.4.3


# This will download the .tar.gz
function download() {
    local BINARY_FILE=$1
    local URL=$2
    echo "===> Downloading: " "${URL}"
    curl -L --retry 5 --retry-delay 3 "${URL}" | tar xz || rc=$?
    if [ -n "$rc" ]; then
        echo "==> There was an error downloading the binary file."
        return 22
    else
        echo "==> Done."
    fi
}
echo "Downloading hyperledger version   $VERSION"
download $VERSION "https://github.com/hyperledger/fabric/releases/download/v${VERSION}/hyperledger-fabric-linux-amd64-${VERSION}.tar.gz"
