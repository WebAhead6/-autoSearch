const fs = require("fs");
const path = require("path");
const missingHandler = require("./missing");
const filePath = path.join(__dirname, "..", "public", "library.txt");
const filterItems = (arr, query) => {
  return arr.filter(
    (el) => el.toLowerCase().indexOf(query.toLowerCase()) !== -1
  );
};

function autoComplete(request, response) {
  let body = "";
  request.on("data", (chunk) => {
    body += chunk;
  });
  request.on("end", () => {
    fs.readFile(filePath, "utf-8", (error, file) => {
      if (error) {
        console.log(error);
        missingHandler(request, response);
      }
      const words = file.split(", ");
      const result = filterItems(words, body);
      console.log(result);
      response.writeHead(200, { "content-type": "text/html" });
      response.end(JSON.stringify(result));
    });
  });
}

module.exports = autoComplete;
