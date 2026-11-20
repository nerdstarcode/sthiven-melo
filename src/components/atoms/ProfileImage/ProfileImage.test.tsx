import { render, screen } from '@testing-library/react'
import { ProfileImage } from './ProfileImage'

describe('ProfileImage', () => {
  it('renderiza a imagem com o alt informado', () => {
    render(<ProfileImage alt='Foto de perfil' />)
    expect(screen.getByAltText('Foto de perfil')).toBeInTheDocument()
  })

  it('mescla className', () => {
    render(<ProfileImage alt='foto' className='max-w-sm' />)
    expect(screen.getByAltText('foto')).toHaveClass('max-w-sm', 'rounded-2xl')
  })
})
