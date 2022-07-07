import {createBrowserHistory,createHashHistory} from "history";

//let history = createBrowserHistory();
const isServer = (typeof window === 'undefined');

let history = null;
let browserHistory = null;
if(!isServer){
    history = createHashHistory();
    browserHistory = createBrowserHistory();
}

class History{
    static push=(params)=>{
        if(isServer){return;}
        if (typeof params === 'string'){
            history.push({pathname:params,state:{}});
        }else if(params instanceof Object){
            history.push(params);
        }
    }
}

class BrowserHistory{
    static push=(params)=>{
        if(isServer){return;}
        if (typeof params === 'string'){
            browserHistory.push({pathname:params,state:{}});
            browserHistory.go();
        }else if(params instanceof Object){
            browserHistory.push(params);
            browserHistory.go();
        }
    }
}
export {History as HashHistory};
export {BrowserHistory};
    