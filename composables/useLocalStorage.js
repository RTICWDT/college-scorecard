export function useLocalStorage() {
  const selectAll = (key) => {
    return JSON.parse(localStorage.getItem(key)) || []
  }

  const isSelected = (data, key) => {
    const selectedItems = selectAll(key)
    return selectedItems.findIndex(item => JSON.stringify(item) === JSON.stringify(data))
  }

  const toggleCompare = (data, key) => {
    let selectedItems = selectAll(key)
    const index = isSelected(data, key)

    if (index >= 0) {
      selectedItems.splice(index, 1)
    } else if (selectedItems.length < 10) {
      selectedItems.push(data)
    }

    localStorage.setItem(key, JSON.stringify(selectedItems))
  }

  return {
    selectAll,
    isSelected,
    toggleCompare
  }
}