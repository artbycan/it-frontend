//'use client'
import Image from 'next/image';
import { API_ENDPOINTS } from '@/app/config/api';

const AboutDetailsPage = async({params}) => {
  const { id } = await params;
  console.log('Image Name:', id)
  return (
    <div>
    <div>Image Name: { id }</div>
    <Image
      src={`${API_ENDPOINTS.files.get}/${id}`}
      width={500}
      height={500}
      alt={id}
      priority={true}
      quality={50}
      />
    </div>
  )
}

export default AboutDetailsPage