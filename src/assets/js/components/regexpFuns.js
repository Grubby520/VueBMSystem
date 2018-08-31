function isntEmpty(val){
    return /.+/.test(val) && val !== null
}

function isNumber(val){
    return !isNaN(Number(val)) && isntEmpty(val) && val > 0
}

function isIP(val){
    return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(val)
}

module.exports = {
    isntEmpty:isntEmpty,
    isNumber:isNumber,
    isIP:isIP
}