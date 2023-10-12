const Node = require('./Node')

module.exports = class List {
    constructor (data) {
        if (data)
            this.create(Array.isArray(data) ? data : arguments)
        else {
            this.head = null
            this.last = null
            this.length = 0
        }
    }

    valideRangeSize(size) {
        if (size >= this.length)
            throw new Error('Out of range')
    }

    validateHead() {
        if (!this.head)
            throw new Error('No node')
    }

    validatePredicate = predicate => {
        if (typeof predicate !== 'function')
            throw new Error('Predicate must be a function')
    }

    findMinusIdx = idx => {
        return idx < 0 ? idx + this.length : idx
    }

    addNode = (pointer, value) => {
        pointer.next = new Node(value)
        pointer.next.prev = pointer
    }

    create(newList) {
        this.head = new Node(newList[0])
        this.length = newList.length
        let current = this.head

        for (let idx = 1; idx < newList.length; idx++, current = current.next) 
            this.addNode(current, newList[idx])

        this.last = current
    }

    from({ length }, predicate) {
        this.validatePredicate(predicate)

        let current = this.head = new Node(predicate(0))
        this.length = length

        for (let idx = 1; idx < length; idx++, current = current.next) 
            this.addNode(current, predicate(idx))

        this.last = current

        return this
    }

    push(...values) {
        if (this.head) {
            let current = this.last
            
            for (let idx = 0; idx < values.length; idx++, current = current.next) 
                this.addNode(current, values[idx])

            this.last = current
        }
        else {
            let current = this.head = new Node(values[0])
            
            for (let idx = 1; idx < values.length; idx++, current = current.next)
                this.addNode(current, values[idx])

            this.last = current
        }

        this.length += values.length
    }

    at(findIdx) {
        if (findIdx < 0)
            findIdx = this.findMinusIdx(findIdx)

        this.valideRangeSize(findIdx)

        if (findIdx < this.length / 2) {
            let current = this.head
            for (let idx = 0; idx < findIdx; idx++, current = current.next);

            return current
        }
        else {
            let current = this.last
            for (let idx = this.length - 1; idx > findIdx; idx--, current = current.prev);

            return current
        }
    }

    indexOf(value) {
        for (let current = this.head, idx = 0; current; current = current.next, idx++) 
            if (current.value === value)
                return idx

        return -1
    }

    includes(value) {
        for (let current = this.head; current; current = current.next)
            if (current.value === value)
                return true

        return false
    }

    find(predicate) {
        this.validatePredicate(predicate)

        for (let current = this.head, idx = 0; current; current = current.next, idx++) 
            if (predicate(current.value, idx, this.head))
                return current
        
        return null
    }

    forEach(predicate) {
        this.validatePredicate(predicate)

        for (let current = this.head, idx = 0; current; current = current.next, idx++) 
            predicate(current.value, idx, this.head)
    }

    map(predicate) {
        const newList = new List()
        this.forEach((value, idx, list) => newList.push(predicate(value, idx, list)))

        return newList
    }
    
    reduce(predicate, accumulator = '') {
        this.validatePredicate(predicate)

        let current = this.head, idx = 0
        for (; current.next; current = current.next, idx++) 
            accumulator = predicate(accumulator, current.value, idx, this.head)

        return predicate(accumulator, current.value, idx, this.head)
    }

    filter(predicate) {
        const newList = new List()
        this.forEach((value, idx, list) => predicate(value, idx, list) && newList.push(value))

        return newList
    }

    sort(predicate) {
        !predicate && (predicate = (previous, current) => previous - current)

        this.validatePredicate(predicate)

        const partition = (low, high) => {
            const pivot = this.at(high).value;
            let i = low - 1;
    
            for (let j = low; j < high; j++)
                if (predicate(this.at(j).value, pivot) < 0) {
                    i++;
                    [this.at(i).value, this.at(j).value] = [this.at(j).value, this.at(i).value]
                }

            [this.at(i + 1).value, this.at(high).value] = [this.at(high).value, this.at(i + 1).value]
            return i + 1
        }
    
        const quickSort = (low, high) => {
            if (low < high) {
                const pi = partition(low, high);
                quickSort(low, pi - 1);
                quickSort(pi + 1, high);
            }
        }
    
        quickSort(0, this.length - 1)

        return this
    }
    

    reverse() {
        const reversedList = new List()

        for (let current = this.last; current; current = current.prev)
            reversedList.push(current.value)
            
        return reversedList
    }

    toArray() {
        const array = []
        let current = this.head

        for (; current; current = current.next)
            array.push(current.value)

        return array
    }

    slice(startIdx, finishIdx = this.length) {
        startIdx = this.findMinusIdx(startIdx)
        finishIdx = this.findMinusIdx(finishIdx)

        this.valideRangeSize(startIdx)
        this.valideRangeSize(finishIdx - 1)

        const newList = new List()

        if (startIdx >= finishIdx)
            return newList

        let current = this.head
        let idx = 0

        for (; idx < startIdx; idx++, current = current.next);

        for (; idx < finishIdx; idx++, current = current.next)
            newList.push(current.value)

        return newList
    }

    pop() {
        this.validateHead()
        
        this.last = temp.last.prev
        this.last.next = null
        this.length--
    }

    delete(idx) {
        this.validateHead()

        idx = this.findMinusIdx(idx)

        if (idx === 0)
            [ this.head, this.head.next.prev ] = [ this.head.next, null ]
        else if (idx === this.length - 1) {
            this.last = temp.last.prev
            this.last.next = null
        }
        else {
            let current = this.at(idx);
            [ current.prev.next, current.next.prev ] = [ current.next, current.prev ]
        }

        this.length--
    }
}