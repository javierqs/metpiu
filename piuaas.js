Steps = new Meteor.Collection("steps");

var names = []
var step_keys = {"97":"bl","103":"tl","101":"m","105":"tr","99":"br"}
for(var key in step_keys){names.push(step_keys[key])}

var flecha = function(li_id, li_top) {
  this.velocidad = 4;
  this.li = document.createElement("li");
  this.y = 450 + li_top
  this.li.className = "arrow"
  this.li.id = "song_" + li_id
  this.mover = function(){ window.setTimeout(moviendo,10,this) }
  this.li.onclick=function(){ this.parentNode.removeChild(this) } 
};

function moviendo(e){
  var steps_a = e.li.parentNode.children
  if(steps_a[steps_a.length - 1].style.top.split("px")[0] >= 0){
    e.y -= e.velocidad
    e.li.style.top = e.y + "px"
    window.setTimeout(moviendo,10,e)
  }
}

if (Meteor.isClient) {
  document.onkeydown = function(e) {
    e = e || window.event;
    var step_start;
    if(e.keyCode == '97' || e.keyCode == '99' || e.keyCode == '101' || e.keyCode == '103' || e.keyCode == '105'){
      step_start = Steps.find({key_name: step_keys[e.keyCode]}).fetch()[0];
      Steps.update(step_start._id, {$set: {flag_pressed: true}})
    }
  };

  document.onkeyup = function(e) {
    e = e || window.event;
    var step_end;
    if(e.keyCode == '97' || e.keyCode == '99' || e.keyCode == '101' || e.keyCode == '103' || e.keyCode == '105'){
      step_end = Steps.find({key_name: step_keys[e.keyCode]}).fetch()[0];
      Steps.update(step_end._id, {$set: {flag_pressed: false}})
    }
  };

  Template.screen.steps = function() {
    return Steps.find();
  };

  Template.screen.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        var new_arrow;
        for(var i = 0; i < 100; i++){
          var pos_names = Math.floor(Math.random() * names.length)
          new_arrow = new flecha(names[pos_names], i * 60);
          new_arrow.li.style.left = (60 * pos_names) + "px"
          document.getElementById('song_steps').appendChild(new_arrow.li)
          new_arrow.mover()
        }
    }
  });

  Template.step.pressed = function() {
    if (this.flag_pressed) {
      return this.key_name
    }else{
      return ''
    }
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Steps.find().count() === 0) {
      for (var i = 0; i < names.length; i++)
        Steps.insert({key_name: names[i]});
    }
  });
}