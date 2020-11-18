import { PipeTransform, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Exceptions } from 'src/common/exceptions/exceptions.constant';
import { HttpDomainException } from '../../common/exceptions/http.exception';

@Injectable()
export class ParseDatePipe implements PipeTransform<string> {
  format: string;
  constructor(format?: string) {
    this.format = format;
  }
  transform(value: string) {
    const momentDate = moment(value, this.format, this.format !== undefined);
    if (momentDate.isValid()) {
      return momentDate.toDate();
    } else {
      const message = Exceptions.INVALID_DATE.MESSAGE;
      const error = this.format ? Exceptions.INVALID_DATE.ERROR + this.format : undefined;
      throw new HttpDomainException({ message, error });
    }
  }
}
