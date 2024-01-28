import { integer, Maximum, Positive } from '@deepkit/type';


export type Pagination = {
    limit: integer & Positive & Maximum<100>
    offset: integer & Positive
}
