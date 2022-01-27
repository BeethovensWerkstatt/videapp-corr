export const sortTag = {
  work: 'work',
  movementMeasure: 'movementMeasure',
  revisionObject: 'objects',
  textOperation: 'operation',
  classification: 'classes',
  context: 'context',
  implementation: 'implementation',
  document: 'document'
}
export const tagLabel = {
  [sortTag.work]: 'terms.work',
  [sortTag.movementMeasure]: 'terms.movement',
  [sortTag.revisionObject]: 'terms.complaint.revision-object',
  [sortTag.textOperation]: 'terms.complaint.text-operation',
  [sortTag.classification]: 'terms.complaint.classification',
  [sortTag.context]: 'terms.complaint.context',
  [sortTag.implementation]: 'terms.complaint.implementation',
  [sortTag.document]: 'terms.document'
}

export const complaintFilterTags = {
  objects: [
    'bw_object_dynamic',
    'bw_object_pitch',
    'bw_object_bogensetzung',
    'bw_object_rhythm',
    'bw_object_ornament',
    'bw_object_octave',
    'bw_object_pedal',
    'bw_object_articulation',
    'bw_object_clef',
    'bw_object_arpeggio',
    'bw_object_rest',
    'bw_object_fingering'
  ],
  operation: [
    'bw_textoperation_einfuegung',
    'bw_textoperation_tilgung',
    'bw_textoperation_ersetzung',
    'bw_textoperation_umstellung'
  ],
  classes: [
    'bw_classification_korrektur',
    'bw_classification_variante',
    'bw_classification_textpraezisierung',
    'bw_classification_schriftbildliche_verbesserung',
    'bw_classification_paratextliche_eingriffe'
  ],
  context: [
    'bw_kontext_korrekt',
    'bw_kontext_unvollstaendig',
    'bw_kontext_korrumpiert'
  ],
  implementation: [
    'bw_fully_implemented',
    'bw_partially_implemented',
    'bw_not_implemented'
  ]
}
