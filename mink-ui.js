var _el;

function dragOver(e) {
  if (isBefore(_el, e.target)) {
    e.target.parentNode.insertBefore(_el, e.target)
  } else {
   // e.target.parentNode.insertBefore(_el, e.target.nextSibling)
  }
}

function dragStart(e) {
  e.dataTransfer.effectAllowed = "move"
  e.dataTransfer.setData("text/plain", null)
  _el = e.target
  sanityCheck()
}

function isBefore (el1, el2) {
  if (el1 && el2 && el2.parentNode === el1.parentNode)
    for (var cur = el1.previousSibling; cur && cur.nodeType !== 9; cur = cur.previousSibling)
      if (cur === el2)
        return true
  return false
}

function sanityCheck () {
  const minkContainer = document.querySelector('mink-container')
  const pList = minkContainer.querySelectorAll('precedence-box')
  let sanityCheckString = ''
  const sanityCheckLineBreak = '<br />' // Distinguish console logging from DOM display
  for (let i = 0; i < pList.length; i++) {
    let srcs = pList[i].querySelectorAll('aggregation-source')

    // Identify how many sources are disabled
    const disabledCount = Array.from(srcs).filter((src) => src.hasAttribute('data-disabled')).length
    let dString = disabledCount == 0 ? '' : `(${disabledCount} disabled)`

    sanityCheckString += `Step ${i+1}: Query ${srcs.length} sources ${dString}${sanityCheckLineBreak}`
  }
  document.getElementsByTagName('footer')[0].innerHTML = sanityCheckString
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

function toggleEnabled (el) {
  const disabled = this.dataset.disabled || false
  const srcName = this.getElementsByTagName('src-name')[0].innerHTML

  if (disabled) {
    delete this.dataset.disabled
    // this.dataset.disabled = 'false'
    // this.setAttribute('data-disabled', 'false')
    console.log(`${srcName} has been enabled`)
  } else {
    this.dataset.disabled = 'true'
    this.setAttribute('data-disabled', 'true')
    console.log(`${srcName} has been disabled`)
  }
  console.log(this)
}

function showSourceInfo (e) {
  console.log(this)
}

window.addEventListener('load', function () {
    const el = document.querySelector('mink-container');
    let sortable = Sortable.create(el,{
        handle: 'aggregation-source'
    })
    document.querySelector('#sanityCheck').addEventListener('click', sanityCheck)
    document.querySelector('#fetch').addEventListener('click', function () {
        fetchDataSource('https://oduwsdl.github.io/MemGator/archives.json')
    })

    document.querySelectorAll('aggregation-source').forEach(function (src) {
        src.addEventListener('dblclick', toggleEnabled)
        src.addEventListener('click', showSourceInfo)
    })
})