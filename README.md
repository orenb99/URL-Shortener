Utilities

createSqlDate
A function that generates a new date and returns it in SQL format

validateOriginal
A function that gets an url and checks if its valid or not with the help of checkError

checkError
A function that returns the kind of the error that happened in validateOriginal.

Database

database is a class that reads and process's the information in the data.json file and converts it into an array.
    update data
    a method that updates the data file to match the information in the storage

    post
    a method that adds an item to the storage array and updates the data file

    addRedirect
    a method that added 1 to the item's redirect count and updates the data file

    clear
    a method that clears storage array and updates the data file
    
    getData
    a method that updates the storage to match the data file. executes as a middleware function before every response.

    addressExists
    a method that checks if a url exists in the storage

    updateShortUrl
    a method that updates the shortUrl




