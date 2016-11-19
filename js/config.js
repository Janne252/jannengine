// Config
var __debug = true;
var __useMinified = false;
var __mainpackage = 'spaceWars';
var __combined = true;

requirejs.config({
    baseUrl: 'js/out',
    urlArgs: function(id, url)
    {
        if (__debug)
        {
            return  '?t=' + (new Date()).getTime();
        }
        else
        {
            return '';
        }
    },
    paths: 
    {
        
    }
});

//lauch app

if (__combined)
{
    requirejs(['combined' + (__useMinified ? '.min' : '')], function()
    {
        requirejs([__mainpackage], function(mainPackage) {});
    });
}
else
{
    requirejs([__mainpackage], function(mainPackage) {});
}