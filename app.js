var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    Math        = require("./models/math"),
    Science     = require("./models/science"),
    History     = require("./models/history"),
    Answer      = require("./models/answer"),
    User        = require("./models/user"),
    seedDb      = require("./seeds");
    
    

// requiring routes
var mathAnswerRoutes = require("./routes/math/answer"),
    scienceAnswerRoutes = require("./routes/science/answer"),
    historyAnswerRoutes = require("./routes/history/answer"),
    indexRoutes = require("./routes/index"),
    mathRoutes = require("./routes/math/math"),
    scienceRoutes = require("./routes/science/science"),
    historyRoutes = require("./routes/history/history");


var url = process.env.DATABASEURL || "mongodb://localhost/homeworkhelp_v8";
mongoose.connect(url); 

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());


// PASSPORT CONFIG
app.use(require("express-session")({
   secret: "Help!",
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// middleware that runs for every route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use("/", indexRoutes);

app.use("/math", mathRoutes);
app.use("/math/:id/answers/math", mathAnswerRoutes);

app.use("/science", scienceRoutes);
app.use("/science/:id/answers/science", scienceAnswerRoutes);

app.use("/history", historyRoutes);
app.use("/history/:id/answers/history", historyAnswerRoutes);

 
 
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Homework Help Server has started!");
});