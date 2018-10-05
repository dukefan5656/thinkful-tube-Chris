'use strict';

let API_Key = "AIzaSyBfs4QmVd79TQTKA0GaEOmr31jwYKQm2z8";

let endpoint = "https://www.googleapis.com/youtube/v3/search";

const store = {
  videos: [],
  defaultToken: undefined,
  nextPageToken: undefined,
  prevPageToken: undefined,
  pageToken: undefined,
};

const getDataFromApi = function(searchTerm, callback){
  const settings = {
    part: 'snippet',
    q: searchTerm,
    key: API_Key,
    // maxResults: 20,
    order: 'viewCount',
    pageToken: store.pageToken,
    videoEmbeddable: true,
    type: 'video'
  };
  console.log(settings.pageToken);
  if($('.js-more').attr('data-id') == "0"){
    settings.pageToken = store.defaultToken;
    console.log('token is undefined');
  }
  else if ($('.js-more').attr('data-id') == "1"){
    settings.pageToken = store.nextPageToken;
  } else {
    settings.pageToken = store.prevPageToken;
  }
    $.getJSON(endpoint, settings, callback);
  console.log(settings);
};

const handleSubmit = function(){
  $('form').submit( event => {
    // event.preventDefault();
    let hold = $('.js-query').val();
    store.prevPageToken = undefined;
    store.pageToken = undefined;
    $('.js-more').attr('data-id', 0);
    getDataFromApi(hold, response => {
      store.nextPageToken = response.nextPageToken;
      const decoratedVideos = decorateResponse(response);
      addVideosToStore(decoratedVideos);
      displayResults();
    });
  });
};

const addVideosToStore = function(videos) {
  store.videos = videos;
};


{/* <img src="${video.thumbnail}"/> */}
const renderResults = function(video) {
  return `<li data-id="${video.id}">
            <h3>${video.title}</h3>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.id}" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>
            <p>${video.description}</p>
            <a href="https://www.youtube.com/channel/${video.channelId}">Follow Link to Channel</a>
          </li>
  `;
};

const displayResults = function(){
  const htmlElements = store.videos.map(item => renderResults(item));
  $('.js-search-results').html(htmlElements);
};


const decorateResponse = function(response){
  console.log(response);
  return response.items.map(item => {
    return {
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelId: item.snippet.channelId
    };  
  });
};

//base url of youtube.com/watch?v=videoId

const handleThumbnailClick = function(){
  $('.js-search-results').on('click', 'img', function(event){
    event.preventDefault();


  });
};

const handleMoreClick = function(){
  $('.js-search-form').on('click', '.js-more', function(event){
    event.preventDefault();
    let hold = $('.js-query').val();
    let data = $('.js-more').data('id');
      data++;
      $(this).attr('data-id', data);
    getDataFromApi(hold, response => {
      store.pageToken = store.nextPageToken;
      store.prevPageToken = response.prevPageToken;
      store.nextPageToken = response.nextPageToken;
      const decoratedVideos = decorateResponse(response);
      addVideosToStore(decoratedVideos);
      displayResults();

    });
  });
};

const handleFewerClick = function(){
  $('.js-search-form').on('click', '.js-fewer', function(event){
    event.preventDefault();
    console.log('listening');
    let hold = $('.js-query').val();
    let data = $('.js-more').data('id');
      data--;
      $('.js-more').attr('data-id', data);
    getDataFromApi(hold, response => {
      store.pageToken = store.nextPageToken;
      store.prevPageToken = response.prevPageToken;
      store.nextPageToken = response.nextPageToken;
      const decoratedVideos = decorateResponse(response);
      addVideosToStore(decoratedVideos);
      displayResults();
    });
  });
};

$(function(){
  handleSubmit();
  handleMoreClick();
  handleFewerClick();
});