
// == menu click events ==

// Display Modes.
// Set 'Ball and Stick'.
$("#BS").click(function() {
  viewer.specs.set3DRepresentation('Ball and Stick');
  viewer.updateScene();
  popupViewer.specs.set3DRepresentation('Ball and Stick');
  popupViewer.updateScene();
});

// Set 'Space Filling'.
$("#SF").click(function() {
  viewer.specs.set3DRepresentation('van der Waals Spheres');
  viewer.updateScene();
  popupViewer.specs.set3DRepresentation('van der Waals Spheres');
  popupViewer.updateScene();
});

// Set 'Wireframe'.
$("#WF").click(function() {
  viewer.specs.set3DRepresentation('Wireframe');
  viewer.updateScene();
  popupViewer.specs.set3DRepresentation('Wireframe');
  popupViewer.updateScene();
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


// Load models
$("#PS").change(function() {
  var proteinModel = $("#PS").val();

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
$("#AS").change(function() {
  var aminoFile,
      popupTitle,
      popupColour;

  var green  = '#77DD77',
      orange = '#FFB347',
      purple = '#B19CD9',
      pink   = '#F49AC2';

  var aminoModel = $("#AS").val();
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

  // Check for 2D mode. I.e. No WebGL
  if (twoD === true) {
    file = ChemDoodle.readMOL(aminoFile);
    file.findRings = false;
    viewer.loadMolecule(file);
  }
  else {
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
  }
});

// Close popup.
// Click.
$("#close").click(function() {
  $("#popup").fadeOut("fast");
  $("#AS").val('Select to view model');
});
// Escape key.
$(document).keydown(function(e) {
  if (e.keyCode == 27) {
    $("#popup").fadeOut("fast");
    $("#AS").val('Select to view model');
  }
});

// Quiz!
var droppedCount = 0,
    correctCount = 0;

// Initialize a new game.
newGame();

function newGame() {
  var words = ["amino", "hydrophobic", "hydrophilic", "nitrogen", "water",  "denatured",  "chymotrypsin",  "hydrogen",   "secondary structure",  "tertiary structure",  "quaternary", "casein", "glycine", "carboxyl"];

  droppedCount = 0;
  correctCount = 0;
  $('#words').html('');
  var shuffledWords = [];

  // Draggables.
  for (var i = 1; i <= words.length; i++) {
    shuffledWords.push($('<div class="tiny button primary">' + words[i - 1] + '</div>').data('id', i).draggable({
      cursor: 'move',
      revert: true,
      stack: '#words div',
      containment: 'container'
    }));
  }

  // Shuffle the array.
  shuffledWords.sort(function() {
    return Math.random() - 0.5;
  });

  for (var j = 0; j < shuffledWords.length; j++) {
    shuffledWords[j].appendTo('#words');
  }
}

// Droppables
$("#statements > p > span").each(function() {
  $(this).droppable({
    accept: '#words div',
    drop: acceptDrop,
    hoverClass: 'hovered',
    tolerance: "touch"
  });
});

function acceptDrop(event, ui) {
  var wordID = ui.draggable.data('id');
  var statementID = $(this).attr('id');
  droppedCount++;

  ui.draggable.position({ of: $(this), my: 'center center', at: 'center center' });
  ui.draggable.draggable( 'option', 'revert', false );

  if (statementID == wordID) {
    ui.draggable.data('correct', 'yes');
    ui.draggable.data('placed', 'yes');
  }
  else {
    ui.draggable.data('correct', 'no');
    ui.draggable.data('placed', 'yes');
  }
}

// Click mark button.
$("#markMe").click(function() {
  if (droppedCount < 11) {
    $("#container").addClass('blur');
    $("#score").text("You have not yet finished answering all of the questions. Please enter all of your answers before submitting.").parent().show();
    return;
  }

  $("#words > div").each(function() {
    if ($(this).data('correct') == 'yes' && ($(this).hasClass('alert') || $(this).hasClass('primary'))) {
      $(this).removeClass('alert').removeClass('primary').addClass('success');
      $(this).draggable( 'disable' );
      correctCount++;
    }
    else if ($(this).data('placed') == 'yes' && $(this).data('correct') == 'no') {
      $(this).addClass('alert');
    }
  });

  if (correctCount >= 0 && correctCount <= 4) {
    $("#container").addClass('blur');
    $("#score").text(correctCount + "/11" + " There is room for improvement. Please go through the information and resources provided and try again!").parent().show();
  }
  else if (correctCount >= 5 && correctCount <= 7) {
    $("#container").addClass('blur');
    $("#score").text(correctCount + "/11" + " You are doing well, but can do better. Please re-visit the structure and information boxes provided, and try again!").parent().show();
  }
  else if (correctCount >= 8 && correctCount <= 10) {
    $("#container").addClass('blur');
    $("#score").text(correctCount + "/11" + " An excellent attempt. Keep studying the information and resources provided and you can achieve a perfect score!").parent().show();
  }
  else if (correctCount >= 11) {
    $("#container").addClass('blur');
    $("#score").text(correctCount + "/11" + " Fantastic work, a perfect score! You have utilised this site and it's information well. Remember to use this site and resources in your exam study.").parent().show();
  }
});

// Click continue button.
$("#cont").click(function() {
  $("#container").removeClass('blur');
  $("#scorePopup").fadeOut('fast');
});

// Click restart button.
$("#restart").click(function() {
  $("#container").removeClass('blur');
  $("#scorePopup").fadeOut('fast');
  newGame();
});
