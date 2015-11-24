var nodeTypes = ['INPUT'];
function checkNodeType ($el) {
  this.config.nodeTypes.some(function (nodeType) {
    return nodeType === $el.nodeName;
  });
}
