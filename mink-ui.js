var _el;

function dragOver(e) {
  if (isBefore(_el, e.target)) {
    e.target.parentNode.insertBefore(_el, e.target)
  } else {
    e.target.parentNode.insertBefore(_el, e.target.nextSibling)
  }
}

function dragStart(e) {
  e.dataTransfer.effectAllowed = "move"
  e.dataTransfer.setData("text/plain", null)
  _el = e.target
}

function isBefore (el1, el2) {
  if (el2.parentNode === el1.parentNode)
    for (var cur = el1.previousSibling; cur && cur.nodeType !== 9; cur = cur.previousSibling)
      if (cur === el2)
        return true
  return false
}

function sanityCheck () {
  const minkContainer = document.querySelector('mink-container')
  const pList = minkContainer.querySelectorAll('precedence-box')
  for (let i = 0; i < pList.length; i++) {
    let srcs = pList[i].querySelectorAll('aggregation-source')

    // Identify how many sources are disabled
    const disabledCount = Array.from(srcs).filter((src) => src.hasAttribute('data-disabled')).length
    let dString = disabledCount == 0 ? '' : `(${disabledCount} disabled)`

    console.log(`Step ${i+1}: Query ${srcs.length} sources ${dString}`)
  }
}

async function fetchDataSource (src) {
  // https://oduwsdl.github.io/MemGator/archives.json
  const resp = await fetch(src)
  const archs = await resp.json()
  convertJsonToArchives(archs)
}

function convertJsonToArchives (jsonSrc) {
  console.log(typeof jsonSrc)

  let root = document.createElement('mink-container')
  for (let a in jsonSrc) {
    console.log(jsonSrc[a])
  }
}