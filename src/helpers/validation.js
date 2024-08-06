exports.validation = (required_fields, data) => {
    const error = {}

    for (let i of required_fields) {
        if (!data[i]) {
            error[i] = `${i} is required`
            // error.push(`${i} is required`)
        }
    }

    // console.log(Object.keys(error));
    return error;
   
}