import { Suspense } from 'react';
import { useLoaderData, json, defer, Await } from 'react-router-dom';

import EventsList from '../components/EventsList';

function EventsPage() {
  const { events } = useLoaderData();

  return (
    //Suspense is a method provided by react to show something when we are awaiting a response as we are doing below
    //await is provided by react-router-dom to help await a response or data as we are await for in the defer method in the loader below 
    //so when data is gotten or resolve={} it authomatically execute the method which have been passed into it that recieves the data and 
    //passess it the event or data which can be sent to the component
    <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
      <Await resolve={events}>
        {(loadedEvents) => <EventsList events={loadedEvents} />}
      </Await>
    </Suspense>
  );
}

export default EventsPage;

async function loadEvents() {
  const response = await fetch('http://localhost:8080/events');

  if (!response.ok) {
    // return { isError: true, message: 'Could not fetch events.' };
    // throw new Response(JSON.stringify({ message: 'Could not fetch events.' }), {
    //   status: 500,
    // });
    throw json(
      { message: 'Could not fetch events.' },
      {
        status: 500,
      }
    );
  } else {
    //and here we can no longer return the direct response we get above as we could normally do because it will be transmitted by the useloaderData
    //but we now have to await and transmit it because we are recieving it by the defer() method as you can see below which is method provided by react-router-dom
    const resData = await response.json();
    return resData.events;
  }
}

export function loader() {
  return defer({
    events: loadEvents(),
  });
}
