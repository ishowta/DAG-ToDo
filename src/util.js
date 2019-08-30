// https://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
export function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    window.location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
  }
