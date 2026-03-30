// TODO: Build out the ProgramDetailPage here.
// This is a shared template for all 5 program detail pages.
// Use the :slug param (via useParams) to load the correct program data.
// All reusable components are in src/components/

import { useParams } from 'react-router'

export default function ProgramDetailPage() {
  const { slug } = useParams()

  return (
    <div>
      <h1>Program: {slug}</h1>
    </div>
  )
}
