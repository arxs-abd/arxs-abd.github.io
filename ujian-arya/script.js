const arr = [2, 4, 6, 1, 7, 9, 8, 3, 5]

Array.prototype.myForEach = (cb) => {
    for (const a in this) console.log(a)
}

arr.myForEach()