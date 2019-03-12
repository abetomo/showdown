const showdown  = require(__dirname + '/../dist/showdown')
converter = new showdown.Converter()

text = `
# hello, markdown!

- item1
- item2

>> hoge

> piyo

# section1
-> 私が先生です
びしばし

<- 私は生徒です
がんばります
`
html = converter.makeHtml(text)
console.log(html)
