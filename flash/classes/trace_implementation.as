public function trace(... arguments){
    for(var i in arguments){
        Utils.customTrace(arguments[i]);
    }
}