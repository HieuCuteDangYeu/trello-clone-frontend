export interface DraggableChange<T> {
  moved?: {
    element: T
    newIndex: number
    oldIndex: number
  }
  added?: {
    element: T
    newIndex: number
    oldIndex: number
  }
  removed?: {
    element: T
    newIndex: number
    oldIndex: number
  }
}
