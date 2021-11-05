import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import db from './db';
import { Tile } from './games/Common';
import { usePrevious } from './hooks';

// Order of operations
// update
// render
// side-effects
const AppI = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <pre>
        Count: {count}
      </pre>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
};

const App0 = () => {
  const [count, setCount] = useState(0);
  const prevCount = useRef(count);

  useEffect(() => {
    console.log('useEffect count', count);
    prevCount.current = count;
  }, [count]);

  console.log(
    'rendering...',
    JSON.stringify(
      {
        count,
        prevCount: prevCount.current,
      },
      null,
      2,
    ),
  );

  return (
    <div>
      <pre>
        Count: {count}
        <br />
        PrevCount: {prevCount.current}
      </pre>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
};

const App1 = () => {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  useEffect(() => {}, [count]);

  return (
    <div>
      <pre>
        Count: {count}
        <br />
        PrevCount: {prevCount}
      </pre>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
};

// Functions
const compare = (a, b) => (a === b ? 'match' : 'nomatch');

const App2 = () => {
  const handler1 = () => {
    console.log('hello');
  };

  const handler2 = () => {
    console.log('hello');
  };

  const v1 = handler1;
  const v2 = handler1;

  return (
    <div>
      <pre>
        <div>H1 === H2: {compare(handler1, handler2)}</div>
        <div>V1 === V2: {compare(v1, v2)}</div>
      </pre>
    </div>
  );
};

const App3 = () => {
  const [count, setCount] = useState(0);

  const handler1 = () => {
    console.log('hello');
  };

  const prevHandler1 = usePrevious(handler1);

  return (
    <div>
      <pre>
        Count: {count}
        <br />
        <div>H1 === PH1: {compare(handler1, prevHandler1)}</div>
      </pre>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
};

const App3i = () => {
  const [count, setCount] = useState(0);
  const handlerRef = useRef(() => {
    console.log('hello');
  });

  const prevHandler1 = usePrevious(handlerRef.current);

  return (
    <div>
      <pre>
        Count: {count}
        <br />
        <div>H1 === PH1: {compare(handlerRef.current, prevHandler1)}</div>
      </pre>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
};

const App3id = () => {
  const [count, setCount] = useState(0);
  const handlerRef = useRef(() => {
    console.log('hello');
  });

  useEffect(() => {
    handlerRef.current = () => {
      console.log('hello', count);
    };
  }, [count]);

  const prevHandler1 = usePrevious(handlerRef.current);

  return (
    <div>
      <pre>
        Count: {count}
        <br />
        <div>H1 === PH1: {compare(handlerRef.current, prevHandler1)}</div>
      </pre>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
};

const App4 = () => {
  const [count, setCount] = useState(0);

  const handler1 = useCallback(() => {
    console.log('hello');
  }, []);

  const prevHandler1 = usePrevious(handler1);

  return (
    <div>
      <pre>
        Count: {count}
        <br />
        <div>H1 === PH1: {compare(handler1, prevHandler1)}</div>
      </pre>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
};

const Button = memo(({ addPhoto }) => {
  console.log('Rendering Button...');
  return <button onClick={addPhoto}>+</button>;
});

const App5 = () => {
  const [photos, setPhotos] = useState([]);

  const addPhoto = () => {
    setPhotos(oldPhotos => {
      const newPhoto = db[oldPhotos.length];
      return [...oldPhotos, newPhoto.urls.small];
    });
  };

  const prevAddPhoto = usePrevious(addPhoto);

  return (
    <div>
      <pre>AddPhoto === PrevAddPhoto: {compare(addPhoto, prevAddPhoto)}</pre>
      <Button addPhoto={addPhoto} />
      <div style={{ display: 'flex' }}>
        {photos.map(p => (
          <Tile key={p} img={p} alt="test" />
        ))}
      </div>
    </div>
  );
};

const App6 = () => {
  const [photos, setPhotos] = useState([]);

  const addPhoto = useCallback(() => {
    setPhotos(oldPhotos => {
      const newPhoto = db[oldPhotos.length];
      return [...oldPhotos, newPhoto.urls.small];
    });
  }, []);

  const prevAddPhoto = usePrevious(addPhoto);

  return (
    <div>
      <pre>AddPhoto === PrevAddPhoto: {compare(addPhoto, prevAddPhoto)}</pre>
      <Button addPhoto={addPhoto} />
      <div style={{ display: 'flex' }}>
        {photos.map(p => (
          <Tile key={p} img={p} alt="test" />
        ))}
      </div>
    </div>
  );
};

export default AppI;
