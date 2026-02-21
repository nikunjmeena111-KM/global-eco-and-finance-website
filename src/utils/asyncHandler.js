
// this is wrapper code to handle yje async and await in our project 
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
            .resolve(requestHandler(req, res, next))
            .catch(next)
    }
}

export { asyncHandler }