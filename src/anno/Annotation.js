
/**
 * class to store an annotation
 */
class Annotation {
  /**
     * construct Annotation object
     * @param uid the id of the measure
     * @param txt the text of the annotation
     */
  constructor (uid, txt) {
    this.uid = uid
    this.text = txt
  }
}

export default Annotation
