var nmaps = {
    '<{{char}}>': 'a<{{char}}>',
    '<S-Left>': 'hvkl',
    '<S-Right>': 'v',
    '<S-Up>': 'ht',
    '<S-Down>': 'vjh',
    '<C-v>': '"+gPi',
    '<C-s>': ':w<CR>a',
    '<C-S-s>': ':wa<CR>a',
    '<C-z>': 'ua',
    '<C-y>': '<C-r>a',
    '<Backspace>': 's',
    '<C-a>': 'ggvG$'
};
var imaps = {
    '<C-v>': '<ESC>"+gPa',
    '<C-s>': '<ESC>:w<CR>',
    '<C-S-s>': '<ESC>:wa<CR>',
    '<ESC>': '<Nop>',
    '<S-Left>': '<ESC>v',
    '<S-Right>': '<ESC>lv',
    '<S-Up>': '<ESC>vlk',
    '<S-Down>': '<ESC>lvjh',
    '<S-ESC>': '<ESC>:call DummyMode()<CR>',
    '<C-z>': '<ESC>u',
    '<C-y>': '<ESC><C-r>',
    '<C-a>': '<ESC>ggvG$'
};
var vmaps = {
    '<S-{{arrow}}>': '<{{arrow}}>',
    '<{{arrow}}>': '<ESC><{{arrow}}>i',
    '<{{char}}>': 'c<{{char}}>',
    '<C-c>': '"+ygv',
    '<C-x>': '"+c',
    '<C-v>': 'd"+gPi',
    '<C-s>': '<ESC>:w<CR>',
    '<C-S-s>': '<ESC>:wa<CR>',
    '<C-z>': '<ESC>ugv',
    '<C-y>': '<ESC><C-r>gv',
    '<Backspace>': 'c',
    '<C-a>': '<ESC>ggvG$',
    '<TAB>': '>gv',
    '<S-TAB>': '<gv'
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
        for (var c = 32; c <= 254; c++) {
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
    for (var key in nmaps) {
        strings = strings.concat(parseMap('n', map, key, nmaps[key]));
    }
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
