const DATAS = [
    // INDOMARET
    {
        "name" : "Tamangapa D'Mansion",
        "type" : "Indomaret",
        "lat" : -5.1901095351362105,
        "long" : 119.49271917048138
    },
    {
        "name" : "Tamangapa 283",
        "type" : "Indomaret",
        "lat" : -5.187321404706767,
        "long" : 119.491652901271
    },
    {
        "name" : "Tamangapa Raya",
        "type" : "Indomaret",
        "lat" : -5.1839154025332785,
        "long" : 119.49027748063489
    },
    {
        "name" : "Tamangapa 115",
        "type" : "Indomaret",
        "lat" : -5.179870007564158,
        "long" : 119.4875419225195
    },
    {
        "name" : "Tamangapa",
        "type" : "Indomaret",
        "lat" : -5.170946886840916,
        "long" : 119.47966643784132
    },
    {
        "name" : "Perumnas Antang",
        "type" : "Indomaret",
        "lat" : -5.167282089592902,
        "long" : 119.48281176447354
    },
    {
        "name" : "Antang Raya 90",
        "type" : "Indomaret",
        "lat" : -5.165105701141663,
        "long" : 119.47733952079453
    },
    // ALFAMART
    {
        "name" : "Tamangapa D'Mansion",
        "type" : "Alfamart",
        "lat" : -5.1895944374654555,
        "long" : 119.49244867398842
    },
    {
        "name" : "Tamangapa Raya 3",
        "type" : "Alfamart",
        "lat" : -5.182259977298772,
        "long" : 119.48799590154326
    },
    {
        "name" : "Tamangapa Manggala",
        "type" : "Alfamart",
        "lat" : -5.175978962044222,
        "long" : 119.48232859397712
    },
    {
        "name" : "Tamangapa (R053)",
        "type" : "Alfamart",
        "lat" : -5.172371032413239,
        "long" : 119.48004004580866
    },
    // ALFAMIDI
    {
        "name" : "Bangkala Tamangapa Raya 2",
        "type" : "Alfamidi",
        "lat" : -5.187085587322779,
        "long" : 119.49163712689882
    },
    {
        "name" : "Tamangapa Raya (ME16)",
        "type" : "Alfamidi",
        "lat" : -5.171056844645963,
        "long" : 119.48002937374122
    },
]

// Fungsi untuk menghitung jarak antara dua koordinat menggunakan rumus Haversine
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    return distance
}

// Fungsi untuk menghitung jarak dari setiap data dalam array DATAS
function calculateDistancesFrom(lat, lon, dataList) {
    return dataList.map(location => {
        const distance = calculateDistance(lat, lon, location.lat, location.long)

        // console.log(`Jarak ${location.type}: ${location.name}: ${distance.toFixed(2)} km`)
        return {
            ...location,
            distance
        }
    })
}

// Structure Table
// Shop (type : Indomaret, Alfamart, Alfamidi, Lainnya)
// id, name, type, lat, long, is_verified, insert_by, created_at, updated_at