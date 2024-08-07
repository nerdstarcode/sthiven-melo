import Link from 'next/link';
import { CircularText } from '../Icons';

export function Recipe() {
  return (
    <div className="viewer">
      <div className="shadow"></div>
      <div className="bowl animate-wiggle animate-infinite">
        <div className="liquid animate-wiggle animate-infinite animate-reverse">
        </div>
      </div>
    </div>
  )
}
