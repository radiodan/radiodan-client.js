Player objects control playlists and how they are played.

# Methods

##add
##clear
##discover
##get
##load
##next
##pause
##play
##previous
##random
##remove
##repeat
##search
##seek
##status
##stop
##updateDatabase
##volume

# Events

##database.modified

Returns statistics on the contents of the music database. Typically triggered by
an [updateDatabase](#updatedatabase) command, when the update discovers new data.

##database.update.start
##database.update.end

##player

Returns the state of the player (random, play state, which song is being played)

##playlist

Returns the contents of the current playlist.

##volume

Returns the volume of the player. Note that this is not the volume of the
physical device, each player has it's own volume level.

