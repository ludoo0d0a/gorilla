

gorilla = function() {
    'use strict';

    const ACTIONS = {
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

    let opts = {}

    function setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    function getCookie(name) {
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
    function query(q, filter){
        var el = document.querySelector(q);
        el = applyFilter(el, filter);
        if (el) {
            return el;
        }
        return false;
    }
    function queryAll(q, filter){
        var els = document.querySelectorAll(q);
        el = applyFilter(el, filter);
        if (els.length>0) {
            return els;
        }
        return false;
    }
    
    function clickIf(q, filter){
        var el = query(q, filter);
        if (el) {
            el.click()
            return true;
        }
        return false;
    }
    function selectIf(q, val, text, filter){
        var el = query(q, filter);
        if (el) {
            if (text!=null){
                const options = el.selectedOptions
                for(var i=0; i<options.length; i++) {
                    let opt = options[i]
                    if (opt.text==text || opt.value==text){
                        el.selectedIndex=i
                        return true;
                    }
                }
            }else if (val!=null){
                el.selectedIndex=val
            }

            return true;
        }
        return false;
    }
    function checkIf(q, filter){
        var el = query(q, filter);
        if (el) {
            el.checked=true
            return true;
        }
        return false;
    }
    function checkAllIf(q, filter){
        var els = queryAll(q);
        if (els) {
            for (const el of els) {
                let _el = applyFilter(el, filter);
                if (_el){
                    _el.checked=true
                }
            }
        }
    }
    function setValueIf(q, text){
        var el = query(q, filter);
        if (el) {
            el.value=text
            return true;
        }
        return false;
    }

    function execAction(action){
        for (const [key, q] of Object.entries(action)) { 
            const fn = ACTIONS[key] 
            if (fn /* && typeof fn == 'prototype' */ ){ 
                return fn.call(q);
            }
        }
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
            opts.actions.forEach(action => {
                let executed = execAction(action /* , filter */ );
            });
        }
    }
    function checkUrl(urls){
        const urlWindow = window.location.href;
        for (const url of urls){
            const re = new RegExp(url.replaceAll('*', '\\w+'))
            if (re.test(urlWindow)){
                return true;
            }
        }
        return false;
    }
    function _on(_opts){
        opts = {
            delay: 1000,
            ..._opts
        }
        if (checkUrl(opts.urls)){
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
        ...ACTIONS,
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
        urls: [
            'https://contenus.elle.fr/*',
            'https://www.form.elle.fr/*',
            'https://ellefrance.qualifioapp.com/*'
        ],
        actions: [
            {click: "#skip"},
            {check: ".flat_checkbox > input.champTexte[required='required']"}
        ],
        delay : 300
   ));
   */