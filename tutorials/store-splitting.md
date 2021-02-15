To keep the source files manageable, the individual elements
(state, mutation, action, getter) are imported as elements of a function-related object. 
In addition, all mutations and actions are registered in the `store/names` object,
so that the names can be called as constants, not as strings.
