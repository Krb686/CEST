function Device( properties ) {
    this.properties = properties;
    for(var i=0;i<properties.length;i++){
        this[properties[i]] = properties[i];
    }
}





{
    'name': 'Cisco Wireless Router',
    'type': 'Router',
    'id' : '134de92c178',
    'mfc' : 'Cisco',
    'model' : 'E1000',
    'properties': {
        'ip' : '192.168.1.12',
        'mac' : '22-DC-C4-92-4D-BE',
        'status' : 'Good',
        'location' ; {
            'lat' : '38.82905',
            'lng' : '-77.30622'
        }
    }
}