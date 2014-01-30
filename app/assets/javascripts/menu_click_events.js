// == menu click events ==

// Display Modes.
// Set 'Ball and Stick'.
$("#BS").click(function() {
  viewer.specs.set3DRepresentation('Ball and Stick');
  viewer.updateScene()
  popupViewer.specs.set3DRepresentation('Ball and Stick');
  popupViewer.updateScene()
});

// Set 'Space Filling'.
$("#SF").click(function() {
  viewer.specs.set3DRepresentation('van der Waals Spheres');
  viewer.updateScene()
  popupViewer.specs.set3DRepresentation('van der Waals Spheres');
  popupViewer.updateScene()
});

// Set 'Wireframe'.
$("#WF").click(function() {
  viewer.specs.set3DRepresentation('Wireframe');
  viewer.updateScene()
  popupViewer.specs.set3DRepresentation('Wireframe');
  popupViewer.updateScene()
});

// Toggle display of hydrophobic/hydrophilic domains.
$("#Hydro").change(function() {
  viewer.specs.proteins_residueColor = $("#Hydro").is(":checked") ? 'polarity' : 'none';
  viewer.updateScene();
});

// Toggle amino acid labels.
$("#Labs").click(function() {
  viewer.specs.atoms_displayLabels_3D =! viewer.specs.atoms_displayLabels_3D;
  viewer.updateScene();
  popupViewer.specs.atoms_displayLabels_3D =! popupViewer.specs.atoms_displayLabels_3D;
  popupViewer.updateScene();
});

// $("#fullScreen").click(function(){
//   var width, height;
//   // var canvas = document.getElementById("viewer");

//   // if(canvas.requestFullScreen) {
//   //   canvas.requestFullScreen();
//   // }
//   // else if(canvas.webkitRequestFullScreen) {
//   //   canvas.webkitRequestFullScreen();
//   // }
//   // else if(canvas.mozRequestFullScreen) {
//   //   canvas.mozRequestFullScreen();
//   // }
//   // else if(element.msRequestFullscreen) {
//   //   element.msRequestFullscreen();
//   // }

//   width = $(window).innerWidth();
//   height = $(window).innerHeight();
//   //viewer.resize(width, height);
//   //viewer.loadMolecule(file);
//   //$("#viewer").css({"display": "block", "width": width, "height": height});
// });

// End display modes.

// // Count nitrogen atoms test.
// $("#test").click(function() {
//   alert(ChemDoodle.countNitrogens(file));
// });

// Load models
var proteinModel;
$("#PS").change(function() {
  proteinModel = $("#PS").val();
  switch(proteinModel) {
    case "4F5S":
      file = pdb_4F5S;
      viewer.loadMolecule(file);
      break;
    case "1BEB":
      file = pdb_1BEB;
      viewer.loadMolecule(file);
      break;
    case "1BLF":
      file = pdb_1BLF;
      viewer.loadMolecule(file);
      break;
    case "1B8E":
      file = pdb_1B8E;
      viewer.loadMolecule(file);
      break;
    case "1F6S":
      file = pdb_1F6S;
      viewer.loadMolecule(file);
      break;
  }
});

// Right click canvas popup.
// $("#viewer").bind('contextmenu', function(e) {
//   // $("#header").css("background-color", "#F49AC2");
//   // $("#header").text("Testing.");
//   $("#popup").css({
//     top: e.pageY - 19,
//     left: e.pageX + 6
//   }).fadeIn('fast');

//   //popupViewer.startAnimation();
//   return false;
// });

// Load amino model.
var aminoModel,
    popupTitle,
    popupColour,
    aminoFile;

var green  = '#77DD77',
    orange = '#FFB347',
    purple = '#B19CD9',
    pink   = '#F49AC2';

$("#AS").change(function() {
  aminoModel = $("#AS").val();
  switch(aminoModel) {
    case "Trp":
      aminoFile = mol_TRYPTOPHAN;
      popupTitle = 'Tryptophan, Trp (W)';
      popupColour = green;
      break;
    case "Phe":
      aminoFile = mol_PHENYLALANINE;
      popupTitle = 'Phenylalanine, Phe (F)';
      popupColour = green;
      break;
    case "Gly":
      aminoFile = mol_GLYCINE;
      popupTitle = 'Glycine, Gly (G)';
      popupColour = green;
      break;
    case "Ala":
      aminoFile = mol_ALANINE;
      popupTitle = 'Alanine, Ala (A)';
      popupColour = green;
      break;
    case "Val":
      aminoFile = mol_VALINE;
      popupTitle = 'Valine, Val (V)';
      popupColour = green;
      break;
    case "Ile":
      aminoFile = mol_ISOLEUCINE;
      popupTitle = 'Isoleucine, Ile (I)';
      popupColour = green;
      break;
    case "Leu":
      aminoFile = mol_LEUCINE;
      popupTitle = 'Leucine, Leu (L)';
      popupColour = '#77DD77';
      break;
    case "Met":
      aminoFile = mol_METHIONINE;
      popupTitle = 'Methionine, Met (M)';
      popupColour = green;
      break;
    case "Pro":
      aminoFile = mol_PROLINE;
      popupTitle = 'Proline, Pro (P)';
      popupColour = green;
      break;
    case "Tyr":
      aminoFile = mol_TYROSINE;
      popupTitle = 'Tyrosine, Tyr (Y)';
      popupColour = orange;
      break;
    case "Ser":
      aminoFile = mol_SERINE;
      popupTitle = 'Serine, Ser (S)';
      popupColour = orange;
      break;
    case "Thr":
      aminoFile = mol_THREONINE;
      popupTitle = 'Threonine, Thr (T)';
      popupColour = orange;
      break;
    case "Asn":
      aminoFile = mol_ASPARAGINE;
      popupTitle = 'Aspargine, Asn (N)';
      popupColour = orange;
      break;
    case "Gln":
      aminoFile = mol_GLUTAMINE;
      popupTitle = 'Glutamine, Gln (Q)';
      popupColour = orange;
      break;
    case "Cys":
      aminoFile = mol_CYSTEINE;
      popupTitle = 'Cysteine, Cys (C)';
      popupColour = orange;
      break;
    case "Lys":
      aminoFile = mol_LYSINE;
      popupTitle = 'Lysine, Lys (K)';
      popupColour = purple;
      break;
    case "Arg":
      aminoFile = mol_ARGANINE;
      popupTitle = 'Arganine, Arg (R)';
      popupColour = purple;
      break;
    case "His":
      aminoFile = mol_HISTIDINE;
      popupTitle = 'Histidine, His (H)';
      popupColour = purple;
      break;
    case "Asp":
      aminoFile = mol_ASPARTIC_ACID;
      popupTitle = 'Aspartic Acid, Asp (D)';
      popupColour = pink;
      break;
    case "Glu":
      aminoFile = mol_GLUTAMIC_ACID;
      popupTitle = 'Glutamic Acid, Glu (E)';
      popupColour = pink;
      break;
    default:
      break;
  }
  molecule = ChemDoodle.readMOL(aminoFile, 1);
  popupViewer.loadMolecule(molecule);

  $("#header").text(popupTitle)
  .css({"background-color": popupColour, "border-bottom-color": popupColour});

  $("#arrow").css("border-right-color", popupColour);

  $("#popup").css({
    top: 54,
    left: 8
  })
  .css("border-color", popupColour)
  .fadeIn('fast');
});

// Close popup.
// Click.
$("#close").click(function() {
  $("#popup").fadeOut("fast");
  $("#AS").val('Select to view model');
  //popupViewer.stopAnimation();
});
// Escape key.
$(document).keydown(function(e) {
  if (e.keyCode == 27) {
    $("#popup").fadeOut("fast");
    $("#AS").val('Select to view model');
    //popupViewer.stopAnimation();
  };
});

// Click guided tour button
// $("#startTour").click(function() {
//   $('#helpModal').foundation('reveal', 'close');

//   // $(document).foundation('joyride', 'start');

// });

// Quiz!

var answers = ["amino", "water", "casein", "hydrophobic", "secondary structure", "tertiary structure", "hydrogen", "hydrophilic", "denatured", "glycine", "chymotrypsin", "caboxyl", "nitrogen", "quaternary", ];
// answers.sort(function() { return Math.random() - .5 });

var count = 0;
// Draggables.
$('#words > div').each(function() {
  $(this).draggable({
    cursor: 'move',
    revert: true,
    stack: '#words div',
    containment: 'container'
  });
});

// Droppables
$('#statements > p > span').each(function() {
  $(this).droppable({
    accept: '#words div',
    drop: acceptDrop,
    hoverClass: 'hovered',
    tolerance: "touch"
  });
});

function acceptDrop(event, ui) {
  ui.draggable.position({ of: $(this), my: 'center center', at: 'center center' });
  ui.draggable.draggable( 'option', 'revert', false );
}

//ui.draggable.addClass('success');
//ui.draggable.draggable( 'disable' );
//$(this).droppable( 'disable' );

//$

// $("#popup").draggable({
//   cursor: 'move'
// });
