import { CardCarousel, RandomCarousel, ReverseCarousel, PodeGostar, Carousel, Populares, Destaque, Free2Play, SolidCards, LinhaPulsante, ThreeCards, ThreeCards2, VejaMais } from '../../components';

const Inicial = () => {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-6xl px-4 py-16"> 

        <div className="w-full mb-8">
          <Carousel />
        </div>

        <LinhaPulsante/>

        <br></br>
              <Destaque />
        <br></br>
        
        <div className="mt-8 mb-20 w-full">
          <CardCarousel />
        </div>

        <LinhaPulsante/>

        <div className="mt-8 mb-20 w-full">
          <ReverseCarousel />
        </div>

        <LinhaPulsante/>

        <br></br>
              <VejaMais/>
        <br></br>

        <div className="mt-8 mb-20 w-full">
          <Free2Play />
        </div>
        <LinhaPulsante/>
        
        <div className="mt-8 mb-20 w-full">
          <ThreeCards />
        </div>

        <LinhaPulsante/>

        <br></br>
              <PodeGostar/>
        <br></br>
        
        <div className="mt-8 mb-20 w-full">
          <RandomCarousel/>
        </div>

        <LinhaPulsante/>
        
        <div className="mt-8 mb-20 w-full">
          <ThreeCards2 />
        </div>

        <LinhaPulsante/>

        <br></br>
              <Populares/>
        <br></br>

        <div className="mt-8 mb-20 w-full">
          <SolidCards />
        </div>
      </main>
    </div>
  );
};

export { Inicial };
