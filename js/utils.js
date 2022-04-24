export const format = String.prototype.format = function(args) {
    let text = this;
    for(var attr in args){
        text = text.split('{' + attr + '}').join(args[attr]);
    }
    return text;
}