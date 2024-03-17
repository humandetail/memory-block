export function useCheckedBlocks(blocks: Ref<Set<string>>) {
  const allBlocks = [] as HTMLInputElement[]
  const missBlocks = [] as HTMLElement[]
  const wrongBlocks = [] as HTMLElement[]

  /**
   * 获取页面中所有的 block
   */
  function getAllBlocks() {
    const blocks = document.querySelectorAll<HTMLInputElement>(
      'input.peer[type="checkbox"]',
    )

    allBlocks.push(...blocks)
  }

  /**
   * 标记所有漏选的 block
   */
  function markAllMissBlocks() {
    allBlocks.forEach((block) => {
      const coordinate = `${block.dataset.row},${block.dataset.col}`

      // 本该选中但是却没有选中
      if (blocks.value.has(coordinate) && !block.checked) {
        const el = block.nextSibling as HTMLElement

        el.classList.add('!text-yellow-500', 'i-carbon-warning')
        missBlocks.push(el)
      }
    })
  }

  /**
   * 标记所有选错的 block
   */
  function markAllWrongBlocks() {
    const checkedBlocks = getAllCheckedBlocks()

    checkedBlocks.forEach((block) => {
      const coordinate = `${block.dataset.row},${block.dataset.col}`

      if (!blocks.value.has(coordinate)) {
        // 如果选错了, 则收集起来, 再重置的时候需要删除状态
        const el = block.nextSibling as HTMLElement

        el.classList.add('!text-red-500', 'i-carbon-close-large')
        wrongBlocks.push(el)
      }
    })
  }

  /**
   * 取消选择左右选中的 block
   */
  function uncheckAllBlocks() {
    allBlocks.forEach((block) => {
      block.checked = false
    })
  }

  /**
   * 取消选择所有漏选的
   */
  function uncheckMissBlocks() {
    missBlocks.forEach((el) => {
      el.classList.remove('!text-yellow-500', 'i-carbon-warning')
    })

    missBlocks.splice(0)
  }

  /**
   * 取消选择所有选错的 block
   */
  function uncheckWrongBlocks() {
    wrongBlocks.forEach((el) => {
      el.classList.remove('!text-red-500', 'i-carbon-close-large')
    })

    wrongBlocks.splice(0)
  }

  /**
   * 选中所有目标 block
   */
  function checkedTargetBlock() {
    allBlocks.forEach((block) => {
      const coordinate = `${block.dataset.row},${block.dataset.col}`

      if (blocks.value.has(coordinate)) {
        block.checked = true
      }
    })
  }

  /**
   * 获取当前所有选中的 block
   */
  function getAllCheckedBlocks() {
    return allBlocks.filter(block => block.checked)
  }

  /**
   * 匹配所有选中的是否达成胜利条件
   */
  function getAllCheckedResult() {
    const checkedBlocks = getAllCheckedBlocks()

    // 如果选中的数量和生成的数量不相等
    if (checkedBlocks.length !== blocks.value.size) {
      return {
        matched: false,
        blocks: checkedBlocks,
      }
    }

    // 检查所有选中的块的匹配状态
    return {
      matched: checkedBlocks.every(block => blocks.value.has(`${block.dataset.row},${block.dataset.col}`)),
      blocks: checkedBlocks,
    }
  }

  onMounted(() => {
    getAllBlocks()
  })

  onBeforeUnmount(() => {
    allBlocks.splice(0)
    missBlocks.splice(0)
    wrongBlocks.splice(0)
  })

  return {
    uncheckAllBlocks,
    checkedTargetBlock,
    markAllMissBlocks,
    uncheckMissBlocks,
    markAllWrongBlocks,
    uncheckWrongBlocks,
    getAllCheckedResult,
  }
}
