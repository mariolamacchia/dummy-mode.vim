var imaps = {
    '<ESC>': '<Nop>',
    '<S-{{arrow}}>': '<ESC>v<{{arrow}}>',
    '<S-ESC>': '<ESC>:call DummyMode()<CR>',
};
var vmaps = {
    '<S-{{arrow}}>': '<{{arrow}}>',
    '<{{arrow}}>': '<ESC><{{arrow}}>i',
    '<{{char}}>': 'c<{{char}}>',
    '<C-c>': '"+ygv',
    '<C-v>': '"+p',
};


function parseMap(mode, map, key, value) {
    var match = key.match(/{{(.*)}}/);
    var array = [];
    if (match && match[1] === 'arrow') {
        ['Left', 'Right', 'Up', 'Down'].forEach(function(arrow) {
            array.push({
                key: key.replace(/{{arrow}}/g, arrow),
                value: value.replace(/{{arrow}}/g, arrow)
            });
        });
    } else if (match && match[1] === 'char') {
        for (var c = 0; c < 256; c++) {
            array.push({
                key: key.replace(/{{char}}/g, 'Char-' + c),
                value: value.replace(/{{char}}/g, 'Char-' + c)
            });
        }
    } else {
        array.push({
            key: key,
            value: value
        });
    }
    var output = [];
    array.forEach(function(item) {
        if (map) {
            output.push('    ' + mode + 'noremap ' + item.key + ' ' + item.value);
        } else {
            output.push('    ' + mode + 'unmap ' + item.key);
        }
    });
    return output;
}

function parseMaps(map) {
    var strings = [];
    for (var key in imaps) {
        strings = strings.concat(parseMap('i', map, key, imaps[key]));
    }
    for (var key in vmaps) {
        strings = strings.concat(parseMap('v', map, key, vmaps[key]));
    }
    return strings;
}

[
    'let g:dummymode=0',
    'function DummyMode()',
    '  if g:dummymode',
    '    let g:dummymode=0',
].concat(parseMaps()).concat([
    '  else',
    '    let g:dummymode=1',
]).concat(parseMaps(1)).concat([
    '  endif',
    'endfunction',
    'nmap <S-ESC> :call DummyMode()<CR>'
]).forEach(function(str) {
    console.log(str);
});
