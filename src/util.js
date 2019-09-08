// https://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
export function findGetParameter(parameterName) {
    const key = window.location.pathname
    if(key === `/`){
	return null
    }else{
	return key.split('/')[1]
    }
  }
