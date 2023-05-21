import { DEFAULT_ROOM } from '@/components/consts';
import localFont from 'next/font/local'
import Image from 'next/image';

const lovelo = localFont({ src: '../public/fonts/Lovelo-Black.otf' });

export default function Home() {
  return <main className='flex flex-col w-full items-center'>
    <div className='text-center max-w-prose text-black text-xl max-md:text-sm'>
      <p className={`${lovelo.className} m-4`}>
        Bienvenue sur ce petit site
      </p>
      <div className='my-8'></div>
      <p className={`${lovelo.className} m-4`}>
        Pour se rendre vous sur dans une &apos;salle&apos; du site, il suffit d&apos;ajouter un numéro dans l&apos;url.
      </p>
      <p className={`${lovelo.className} m-4 bg-primary py-2`}>
      https://delicieuxsquelette.xyz/{DEFAULT_ROOM}
      </p>
      <p className={`${lovelo.className} m-4`}>
        Tu peux utiliser nimporte quelle numéro mais plus il est grand, moins il sera trouvable !
      </p>
      <div className='my-8'></div>
      <p className={`${lovelo.className} m-4`}>
        Lorsque tu &apos;demande un dessin&apos; dans l&apos;onglet dessiner,
        un emplacement t&apos;es reservé pour 10 minutes, aprés ce temps l&apos;emplacement sera de nouveau disponible et pourra être complété.
      </p>
      <p className={`${lovelo.className} m-4`}>
        ça permet de ne pas faire des trou dans le dessin si quelqu&apos; perd sa page pendant qu&apos;iel dessine
      </p>
      <div className='my-8'></div>
      <p className={`${lovelo.className} m-4`}>
        Dans l&apos;onglet &apos;dessiner&apos;: <br />
      </p>
      <div className={`${lovelo.className} m-4 text-start max-md:text-sm text-base`}>
          <div>
            ⚫ la couleur <div className='w-6 h-4 bg-secondary-light inline-block' /> signifie que l&apos;emplacement adjacent est libre<br />
          </div>
          <div>
            ⚫ la couleur <div className='w-6 h-4 bg-secondary inline-block' /> signifie que l&apos;emplacement a été réservé par quelqu&apos;un il y a moins de 10 minutes
          </div>
        </div>
      <div className='my-8'></div>
      <p className={`${lovelo.className} m-4`}>
        aussi, changer de page pendant un dessin le supprime, il faut attendre avant de pouvoir retrouver l&apos;emplacement (les 10 minutes tavu)
      </p>
      <p className={`${lovelo.className} m-4`}>
        bon griboulli !
      </p>
      <div className='flex flex-col items-center justify-center'> <Image
        alt="mail"
        src="/contact.png"
        width={200}
        height={70}
      /></div>

      <div className='my-16'></div>
    </div>
  </main>



} 
