import { Models, Interfaces } from 'js-data-dao'
import * as _ from 'lodash'

export class BaseDAO<T extends Interfaces.IBaseModel> extends Models.DAO<T> {
  protected validateRequiredFields ( obj: any, required: Array<string> = [] ): Boolean {
    let allCorrect: Boolean = true
    const fields = Object.keys( obj )

    fields.forEach( el => {
      if ( _.indexOf( required, el ) !== -1 ) {
        allCorrect = allCorrect && !_.isEmpty( _.toString( obj[ el ] ) )
      }
    } )

    return allCorrect
  }
}
