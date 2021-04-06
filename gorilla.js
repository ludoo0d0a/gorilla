
//
// Gorilla core framework 
// Can be used as helper for Tampermonkey, and void jQuery conflicts hell
// 
// Author : LudoO
// Version: 0.3
// 

gorilla = function() {
    'use strict';

    const me = this;
    const FN_ACTIONS = {
        setCookie,
        getCookie,
        query,
        queryAll,
        clickIf,
        checkAllIf,
        checkIf,
        setValueIf,
        selectIf
     }
     const FN_ACTIONS_PARAMS = {
        setText
     }

    let opts = {}

    function log(opts, text, r){
        if (!(opts && opts.debug)){
            return;
        }
        console.log(text, r)
    }

    function setCookie(opts) {
        const {name,value,days} = opts || {};
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    function getCookie(opts) {
        const {name} = opts || {};
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function applyFilter(el, filter){
        if (!filter){
            return el;
        }
        if (typeof filter === 'function'){
            el = filter(el)
            return el;
        }else{
            // todo filter can be object
            // filters.urls.forEach(url => {
            //     if (!el.href.contains(url)){
            //         return false;
            //     }
            // })
            return el;
        }
    }
    function query(opts){
        const {q, filter} = opts || {};
        var el = document.querySelector(q);
        el = applyFilter(el, filter);
        if (el) {
            log(opts, 'queryAll', el)
            return el;
        }
        return false;
    }
    function queryAll(opts){
        const {q, filter} = opts || {};
        var els = document.querySelectorAll(q);
        el = applyFilter(el, filter);
        if (els.length>0) {
            log(opts, 'queryAll='+els.length, els)
            return els;
        }
        return false;
    }
    
    function clickIf(opts){
        var el = query(opts);
        if (el) {
            el.click()
            log(opts, 'click', el)
            return true;
        }
        return false;
    }
    function selectIf(opts){
        const {val, text} = opts || {};
        var el = query(opts);
        if (el) {
            if (text!=null){
                const options = el.selectedOptions
                for(var i=0; i<options.length; i++) {
                    let opt = options[i]
                    if (opt.text==text || opt.value==text){
                        el.selectedIndex=i
                        log(opts, 'selectedIndex='+i, el)
                        return true;
                    }
                }
            }else if (val!=null){
                el.selectedIndex=val
                log(opts, 'selectedIndex(val)='+val, el)
            }

            return true;
        }
        return false;
    }
    function checkIf(opts){
        var el = query(opts);
        if (el) {
            el.checked=true
            log(opts, 'check', el)
            return true;
        }
        return false;
    }
    function checkAllIf(opts){
        const {filter, index} = opts || {};
        var els = queryAll(opts);
        if (els && els.length>0) {
            if (index && index>=0){
                // single
                let _el = els[index]
                if (_el){
                    _el.checked=true
                    log(opts, 'checkAllIf.checked', _el)
                }
            }else{
                // multiple
                for (const el of els) {
                    let _el = applyFilter(el, filter);
                    if (_el){
                        _el.checked=true
                        log(opts, 'checkAllIf.multiple.checked', _el)
                    }
                }
            }
        }
    }

    function setText(q, text){
        return setValueIf({q, text})
    }

    function setValueIf(opts){
        const {text} = opts || {};
        var el = query(opts);
        if (el) {
            el.value=text
            log(opts, 'value='+text, el)
            return true;
        }
        return false;
    }

    function execAction(recordAction){
        const {action, delay} = recordAction;
        const fn = FN_ACTIONS[action] 
        if (fn && typeof fn === 'function' ){ 
            if (delay){
                setTimeout(function(){
                    log(opts, 'call delay '+delay+': '+recordAction, fn)
                    fn.call(me, recordAction)
                }, delay);
            }else{
                log(opts, 'call: '+recordAction, fn)
                return fn.call(me, recordAction);
            }
        }

        // for (const [key, q] of Object.entries(recordAction)) { 
            
        // }
        return false;
    }

    // function filter(el){
    //     if (el){
    //         console.log('>>>>'+el.href)
    //         //nos recettes
    //         if (el.href.endsWith('/nos-recettes-gourmandes-de-ratte-du-touquet/')){
    //             console.log('---- STOP nos recettes : '+el.href)
    //            return null;
    //         }
    //         //quitter le jeu
    //         if (el.href === 'https://www.larattedutouquet.com/'){
    //            console.log('--- STOP quitter le jeu : '+el.href)
    //            return null;
    //         }

    //     }
    //     return el;
    // }
    function _main(){
        console.log('debug '+location.href)

        if (opts.clicks){
            opts.clicks.forEach(q => {
                let clicked = clickIf(q, filter);
            });
        }
        if (opts.checks){
            opts.checks.forEach(q => {
                let checked = checkIf(q, filter);
            });
        }
        if (opts.actions){
            const globalStopIfTrue = !!opts.stopIfTrue;
            opts.actions.every(recordAction => {
                //TODO Iterate with delay
                let executed = execAction(recordAction /* , filter */ );
                if (executed && recordAction.stopIfTrue == globalStopIfTrue){
                    //stop
                    console.log('stop on '+JSON.stringify(recordAction) )
                    return false;
                }
                return true;
            });
        }
    }
    function checkUrl(opts){
        const urlWindow = window.location.href;
        for (const url of opts.urls){
            const re = new RegExp(url.replaceAll('*', '.+'))
            if (re.test(urlWindow)){
                log(opts, 'checkUrl='+urlWindow)
                return true;
            }
        }
        return false;
    }
    function _on(_opts){
        opts = {
            delay: 1000,
            debug: false,
            ..._opts
        }
        if (checkUrl(opts)){
            run(opts);
        }
    }

    function run(){
       setTimeout(_main, opts.delay || 500);
        if (opts.interval && opts.interval>0){
            setInterval(_main, opts.interval);
        }
    }

    return {
        ...FN_ACTIONS,
        ...FN_ACTIONS_PARAMS,
        on: _on
    }

}();
window.gorilla = gorilla;

/*
gorilla.on({
    clicks: [
        "#container_page .k-element-animation a"
    ],
    checks: [
        "#container_page .k-element-animation input"
    ],
    interval: 5000,
    delay: 1000
})
*/


/*
    gorilla.on({
        debug: true,
        urls: [
            'https://game.mydomain.com/*',
            'https://www.form.mydomain.com/*'
        ],
        actions: [
            {action:'clickIf', q:"#skip"},
            {action:'checkIf', q:".flat_checkbox > input.champTexte[required='required']"}
        ],
        delay : 300,
        interval: 800
   ));
   */