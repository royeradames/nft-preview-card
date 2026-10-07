/* Native images preserve the supplied challenge assets and their intrinsic dimensions. */
/* eslint-disable @next/next/no-img-element */
export default function Home() {
  return (
    <>
      <main>
        <article className="artwork-card" aria-labelledby="artwork-title">
          <a className="artwork-button" href="/images/image-equilibrium.jpg" aria-label="Equilibrium #3429">
            <img className="artwork" src="/images/image-equilibrium.jpg" width="604" height="604" alt="A translucent cube glowing in blue, pink and orange above a blue surface." fetchPriority="high" />
            <span className="view-overlay" aria-hidden="true"><img src="/images/icon-view.svg" width="48" height="48" alt="" /></span>
          </a>
          <h1 id="artwork-title"><a className="text-link" href="/images/image-equilibrium.jpg">Equilibrium #3429</a></h1>
          <p className="description">Our Equilibrium collection promotes balance and calm.</p>
          <dl className="artwork-facts">
            <div><dt className="sr-only">Sample price</dt><dd className="price"><img src="/images/icon-ethereum.svg" width="11" height="18" alt="" />0.041 ETH</dd></div>
            <div><dt className="sr-only">Sample time remaining</dt><dd><img src="/images/icon-clock.svg" width="17" height="17" alt="" />3 days left</dd></div>
          </dl>
          <div className="creator">
            <img src="/images/image-avatar.png" width="33" height="33" alt="" />
            <div className="creator-copy"><span>Creation of </span><details><summary>Jules Wyvern</summary><p>Artwork credit from the Frontend Mentor practice card.</p></details></div>
          </div>
        </article>
      </main>
      <footer>Practice card by <a href="https://www.frontendmentor.io/challenges/nft-preview-card-component-SbdUL_w0U">Frontend Mentor</a>. Built by <a href="https://royeradames.com">Royer Adames</a>.</footer>
    </>
  );
}
